from django.contrib import admin

from .models import NFT, NFTMetadata
# Register your models here.
admin.site.register(NFT)
admin.site.register(NFTMetadata)
