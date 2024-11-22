# utils.py
def generate_response(context, user_input):
    # Sua lógica para gerar a resposta
    resposta = f"Resposta gerada para a entrada: {user_input}"
    novo_contexto = f"{context}\nUsuário: {user_input}\nAssistente: {resposta}"
    return resposta, novo_contexto