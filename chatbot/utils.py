# utils.py

#funçao para gerar uma resposta teste para o usuário
def generate_response(context, user_input):
    resposta = f"Resposta gerada para a entrada: {user_input}"
    novo_contexto = f"{context}\nUsuário: {user_input}\nAssistente: {resposta}"
    return resposta, novo_contexto