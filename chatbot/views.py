# views.py
from django.shortcuts import render
from django.http import JsonResponse
from .models import ChatContext
from .ai_model import generate_response

def chat_view(request):
    if request.method == 'POST':
        user_input = request.POST.get('user_input')

        # Recupera o contexto do chat da sessão, se disponível
        context = request.session.get('chat_context', '')

        # Caso o contexto não exista na sessão, tenta buscar no banco de dados
        if not context and request.user.is_authenticated:
            chat_context, created = ChatContext.objects.get_or_create(user=request.user)
            context = chat_context.context

        # Chama a função de geração de resposta com o contexto e entrada do usuário
        resposta, context = generate_response(context, user_input)

        # Atualiza o contexto na sessão
        request.session['chat_context'] = context

        # Atualiza ou cria o contexto no banco de dados
        if request.user.is_authenticated:
            chat_context.context = context
            chat_context.save()

        # Retorna a resposta em formato JSON
        return JsonResponse({'message': resposta})

    else:
        # Renderiza o template de chat pela primeira vez
        return render(request, "chatbot/chat.html")
