import json

from django.db import IntegrityError
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core import serializers

from .models import NFT, NFTMetadata

@csrf_exempt
@require_http_methods(["POST"])
def create_nft(request):
    data = json.loads(request.body)
    token_id = data['token_id']
    owner_alias = data['owner_alias']


    try:
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
    except IntegrityError:
        return raise_server_error("Duplicate token_ids is not permitted")



@csrf_exempt
@require_http_methods(["POST"])
def update_nft_favorites(request):
    update_token_id = request.POST['token_id']
    nft = get_object_or_404(NFT, token_id=update_token_id)
    nft_metadata = get_object_or_404(NFTMetadata, nft_id=nft.id)
    nft_metadata.favorites = nft_metadata.favorites + 1
    nft_metadata.save()
    response = serializers.serialize("json", [nft_metadata])
    return HttpResponse(response)



@csrf_exempt
@require_http_methods(["POST"])
def update_nft_views(request):
    update_token_id = request.POST['token_id']
    nft = get_object_or_404(NFT, token_id=update_token_id)
    nft_metadata = get_object_or_404(NFTMetadata, nft_id=nft.id)
    nft_metadata.nft_views = nft_metadata.nft_views + 1
    nft_metadata.save()
    response = serializers.serialize("json", [nft_metadata])
    return HttpResponse(response)



@csrf_exempt
@require_http_methods(["GET"])
def nft_details(request):
    token_id = request.GET.get('token_id')
    nft = get_object_or_404(NFT, token_id=token_id)
    nft_metadata = get_object_or_404(NFTMetadata, nft_id=nft.id)
    response = serializers.serialize("json", [nft, nft_metadata])
    return HttpResponse(response)



def raise_server_error(error_message):
    return JsonResponse({'Server Error': error_message}, status=500)