from django.contrib import admin
from django.urls import path
from . import views

app_name = 'api'
urlpatterns = [
    path('create_nft/', views.create_nft, "name=create-nft"),
    path('update_nft_metadata/', views.update_nft_metadata, "name=update-nft-metadata")
]
