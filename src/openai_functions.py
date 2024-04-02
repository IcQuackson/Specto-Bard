from app import client, CHAT_COMPLETIONS_MODEL, SEED

def call_openai(num_times, prompt, temperature=0.75, use_seed=False):
    for i in range(num_times):
        if use_seed:
            response = client.chat.completions.create(
                model=CHAT_COMPLETIONS_MODEL,
                messages = [{"role":"system", "content":"You are a helpful assistant."},
                            {"role":"user","content": prompt}],
                    max_tokens=60,
                    seed=SEED,
                    temperature = temperature
            )
        else:
            response = client.chat.completions.create(
                model=CHAT_COMPLETIONS_MODEL,
                messages = [{"role":"system", "content":"You are a helpful assistant."},
                            {"role":"user","content": prompt}],
                    max_tokens=60,
                    temperature = temperature
            )
        return response.choices[0].message.content