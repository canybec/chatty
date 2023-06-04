import { OPENAI_KEY } from '$env/static/private'
import { type CreateChatCompletionRequest, type ChatCompletionRequestMessage, type CreateEmbeddingResponse, type CreateEmbeddingRequest, OpenAIApi, Configuration } from 'openai';
import type { RequestHandler } from '@sveltejs/kit';
import { getTokens } from '$lib/tokenizer'
import { json } from '@sveltejs/kit'
import type { Config } from '@sveltejs/adapter-vercel'
import { supabase } from '$lib/supabaseClient'


const configuration = new Configuration({ apiKey: OPENAI_KEY })
const openAi = new OpenAIApi(configuration)



export const config: Config = {
	runtime: 'edge'
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!OPENAI_KEY) {
			throw new Error('OPENAI_KEY env variable not set')
		}

		const requestData = await request.json()

		if (!requestData) {
			throw new Error('No request data')
		}

		const reqMessages: ChatCompletionRequestMessage[] = requestData.messages


		if (!reqMessages) {
			throw new Error('no messages provided')
		}

		let tokenCount = 0

		reqMessages.forEach((msg) => {
			const tokens = getTokens(msg.content)
			tokenCount += tokens
		})

		const moderationRes = await fetch('https://api.openai.com/v1/moderations', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENAI_KEY}`
			},
			method: 'POST',
			body: JSON.stringify({
				input: reqMessages[reqMessages.length - 1].content
			})
		})
		if (!moderationRes.ok) {
			const err = await moderationRes.json()
			throw new Error(err.error.message)
		}

		const moderationData = await moderationRes.json()
		const [results] = moderationData.results
		console.log([results])

		if (results.flagged) {
			throw new Error('Query flagged by openai')
		}

		const seed = reqMessages[reqMessages.length - 1].content

		//create embedding for the query



		const embeddingResponse = await openAi.createEmbedding({
			model: "text-embedding-ada-002",
			input: seed,
		});

		//const embeddingRes: Vector = embeddingResponse.data.data.embeddings[0]




		const embedding = JSON.stringify(embeddingResponse.data.data[0].embedding)

		console.log(typeof embedding)


		console.log('embedding xresponse', embedding)


		const { data, error } = await supabase.rpc('nurse_gpt_search', {
			query_embedding: embedding,
			similarity_threshold: 0.1,
			match_count: 2,
		})

		if (error) {
			console.log('Error:', error)
		} else {
			const contentArray = data.map((row) => row.content)
			const contentString = contentArray.join('\n')
			console.log('Content:', contentString)


		}







		const prompt = `Conversation with an AI nurse\n\n'${contentString}'`;




		tokenCount += getTokens(prompt)

		if (tokenCount >= 4000) {
			throw new Error('Query too large')
		}

		const messages: ChatCompletionRequestMessage[] = [
			{ role: 'system', content: prompt },
			...reqMessages
		]

		const chatRequestOpts: CreateChatCompletionRequest = {
			model: 'gpt-3.5-turbo',
			messages,
			temperature: 0.9,
			stream: true
		}

		const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
			headers: {
				Authorization: `Bearer ${OPENAI_KEY}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(chatRequestOpts)
		})

		if (!chatResponse.ok) {
			const err = await chatResponse.json()
			throw new Error(err.error.message)
		}

		return new Response(chatResponse.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		})
	} catch (err) {
		console.error(err)
		return json({ error: 'There was an error processing your request' }, { status: 500 })
	}
}
