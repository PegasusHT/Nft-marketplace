from django.contrib import admin
from django.urls import path
from . import views

app_name = 'api'
urlpatterns = [
    path('create_nft/', views.create_nft, name='create_nft'),
    path('favorite_nft/', views.favorite_nft, name='favorite_nft'),
    path('post_comment/', views.post_comment, name='post_comment'),
    path('nft_details/', views.nft_details, name='nft_details'),
    path('get_wallet_favorites/', views.get_wallet_favorites, name='get_wallet_favorites'),
    path('get_comments/', views.get_comments, name='get_comments'),
    path('nftmetadata_view/', views.NFTMetadataView.as_view())
]
