from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate

# Definindo o template do prompt com placeholders para 'context' e 'user_input'
template = """
Você é um assistente de chat que só pode responder perguntas sobre jogos de vídeo game.
Histórico de conversa:
{context}

Usuário: {user_input}
Assistente:"""

# Instanciando o modelo
model = OllamaLLM(model='llama3.2:latest')

# Criando o ChatPromptTemplate com o template adequado
prompt = ChatPromptTemplate.from_template(template)

# Usando o operador de encadeamento correto (|) para criar o pipeline
chain = prompt | model

def generate_response(context, user_input):
    # Invocando a cadeia com o contexto e a entrada do usuário
    result = chain.invoke({"context": context, "user_input": user_input})           
    
    # Atualizando o contexto com a nova interação
    context += f"Usuário: {user_input}\nAssistente: {result}\n"
    
    # Retornando tanto a resposta quanto o contexto atualizado
    return result, context
