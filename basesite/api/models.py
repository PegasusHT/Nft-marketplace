from django.db import models

class NFT(models.Model):
    token_uri = models.CharField(max_length=500)

    def __str__(self):
        return self.token_uri


class NFTMetadata(models.Model):
    token_uri = models.ForeignKey(NFT, on_delete=models.CASCADE)
    favorites = models.IntegerField(default=0)