from rest_framework import serializers
from .models import NFTMetadata


class NFTMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = NFTMetadata
        fields = ('nft', 'favorites', 'nft_views', 'created_date')