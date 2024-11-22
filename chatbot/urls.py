from django.urls import path
from . import views

urlpatterns = [
    # Adicione a URL para pegar o contexto inicial
    path('initial-context/', views.get_initial_context, name='initial_context'),
    path('chat/', views.chat_view, name='chat'),
]
