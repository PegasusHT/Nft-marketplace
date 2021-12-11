from django.db import models

class NFT(models.Model):
    token_id = models.CharField(max_length=200, unique=True)
    author_alias = models.CharField(max_length=50, default="")

    def __str__(self):
        return self.token_id


class NFTMetadata(models.Model):
    nft = models.ForeignKey(NFT, on_delete=models.CASCADE)
    favorites = models.IntegerField(default=0)
    nft_views = models.IntegerField(default=0)
    nft_comments = models.IntegerField(default=0)
    created_date = models.DateTimeField('date created')

class MarketPlaceComment(models.Model):
    nft = models.ForeignKey(NFT, on_delete=models.CASCADE)
    comment = models.CharField(max_length=500)
    author_alias = models.CharField(max_length=50)
    author_address = models.CharField(max_length=200)
    up_votes = models.IntegerField(default=0)
    down_votes = models.IntegerField(default=0)
    tips = models.IntegerField(default=0)

class MarketPlaceInteraction(models.Model):
    nft = models.ForeignKey(NFT, on_delete=models.CASCADE)
    wallet_address = models.CharField(max_length=200)
    is_followed = models.BooleanField(default=True)

class CommentInteraction(models.Model):
    comment = models.ForeignKey(MarketPlaceComment, on_delete=models.CASCADE)
    wallet_address = models.CharField(max_length=200)
    is_up_voted = models.BooleanField(default=False)
    is_down_voted = models.BooleanField(default=False)