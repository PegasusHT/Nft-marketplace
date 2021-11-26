from django.shortcuts import render, get_object_or_404

from .models import NFT, NFTMetadata

def create_nft(request):
    token_uri = request.POST['token_uri']
    new_nft = NFT(
        token_uri=token_uri,
    )
    new_nft_metadata = NFTMetadata(
        token_uri=token_uri,
        favorites=0
    )
    new_nft.save()
    new_nft_metadata.save()

def update_nft_metadata(request):
    update_token_uri = request.POST['token_uri']
    update_favorites = request.POST['favorites']
    nft_metadata = get_object_or_404(NFT, pk=update_token_uri)
    nft_metadata.favorites = update_favorites
    nft_metadata.save()
