from django.contrib import admin
from django.urls import path
from . import views

app_name = 'api'
urlpatterns = [
    path('create_nft/', views.create_nft, name='create_nft'),
    path('update_nft_favorites/', views.update_nft_favorites, name='update_nft_favorites'),
    path('update_nft_views/', views.update_nft_views, name='update_nft_views'),
    path('nft_details/', views.nft_details, name='nft_details'),
]
