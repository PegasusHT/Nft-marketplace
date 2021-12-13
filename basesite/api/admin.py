from django.contrib import admin

from .models import NFT, NFTMetadata, MarketPlaceComment, MarketPlaceInteraction, CommentInteraction

# Register your models here.
admin.site.register(NFT)
admin.site.register(NFTMetadata)
admin.site.register(MarketPlaceComment)
admin.site.register(MarketPlaceInteraction)
admin.site.register(CommentInteraction)