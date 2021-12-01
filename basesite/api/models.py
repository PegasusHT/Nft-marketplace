from django.db import models

class NFT(models.Model):
    token_id = models.CharField(max_length=200, unique=True)
    owner_alias = models.CharField(max_length=50, default="")

    def __str__(self):
        return self.token_id


class NFTMetadata(models.Model):
    nft_id = models.ForeignKey(NFT, on_delete=models.CASCADE)
    favorites = models.IntegerField(default=0)
    nft_views = models.IntegerField(default=0)
    created_date = models.DateTimeField('date created')

class MarketPlaceComment(models.Model):
    token_id = models.ForeignKey(NFTMetadata, on_delete=models.CASCADE)
    comment = models.CharField(max_length=500)
    author_alias = models.CharField(max_length=50)
    author_address = models.CharField(max_length=200)
    up_votes = models.IntegerField(default=0)
    down_votes = models.IntegerField(default=0)
    tips = models.IntegerField(default=0)