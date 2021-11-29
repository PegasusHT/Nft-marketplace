from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core import serializers

from .models import NFT, NFTMetadata

@csrf_exempt
@require_http_methods(["POST"])
def create_nft(request):
    token_id = request.POST['token_id']
    owner_alias = request.POST['owner_alias']
    new_nft = NFT(
        token_id=token_id,
        owner_alias=owner_alias
    )
    new_nft.save()
    new_nft_metadata = NFTMetadata(
        nft_id=new_nft,
        created_date=timezone.now()
    )
    new_nft_metadata.save()
    response = serializers.serialize("json", [new_nft, new_nft_metadata])

    return HttpResponse(response)


@require_http_methods(["POST"])
def update_nft_favorites(request):
    update_nft_id = request.POST['id']
    nft = get_object_or_404(NFT, token_id=update_nft_id)
    nft_metadata = get_object_or_404(NFTMetadata, pk=nft.id)
    nft_metadata.favorites = nft_metadata.favorites + 1
    nft_metadata.save()
    response = serializers.serialize("json", [nft_metadata])
    return HttpResponse(response)


@require_http_methods(["POST"])
def update_nft_views(request):
    update_nft_id = request.POST['id']
    nft = get_object_or_404(NFT, token_id=update_nft_id)
    nft_metadata = get_object_or_404(NFTMetadata, pk=nft.id)
    nft_metadata.nft_views = nft_metadata.nft_views + 1
    nft_metadata.save()
    response = serializers.serialize("json", [nft_metadata])
    return HttpResponse(response)


@require_http_methods(["GET"])
def nft_details(request):
    nft_id = request.GET.get('token_id')
    nft = get_object_or_404(NFT, token_id=nft_id)
    nft_metadata = get_object_or_404(NFTMetadata, pk=nft.id)
    response = serializers.serialize("json", [nft, nft_metadata])
    return HttpResponse(response)
