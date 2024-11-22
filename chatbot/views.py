from django.http import JsonResponse
from django.shortcuts import render
from .models import ChatContext
from .ai_model import generate_response


def get_chat_context(request):
    """
    Retorna o contexto do chat da sessão ou do banco de dados.
    """
    if request.user.is_authenticated:
        chat_context_obj = ChatContext.objects.filter(user=request.user).first()
        if chat_context_obj:
            return chat_context_obj.context
    return request.session.get('chat_context', '')


def save_chat_context(request, context):
    """
    Salva o contexto do chat na sessão e, se o usuário estiver autenticado, no banco de dados.
    """
    request.session['chat_context'] = context
    if request.user.is_authenticated:
        chat_context, created = ChatContext.objects.get_or_create(user=request.user)
        chat_context.context = context
        chat_context.save()


def get_initial_context(request):
    if request.method == "GET":
        chat_context = get_chat_context(request)
        return JsonResponse({'context': chat_context})
    return JsonResponse({'error': 'Método não permitido'}, status=405)


def chat_view(request):
    if request.method == "POST":
        user_input = request.POST.get('user_input')
        context = get_chat_context(request)

        # Gera a resposta usando o utilitário
        response, updated_context = generate_response(context, user_input)

        # Salva o novo contexto
        save_chat_context(request, updated_context)

        return JsonResponse({'message': response})

    # Renderiza o template de chat para requisições GET
    return render(request, "chatbot/chat.html")
