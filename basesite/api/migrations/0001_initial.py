# Generated by Django 3.2.9 on 2021-12-01 19:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NFT',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token_id', models.CharField(max_length=200, unique=True)),
                ('owner_alias', models.CharField(default='', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='NFTMetadata',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('favorites', models.IntegerField(default=0)),
                ('nft_views', models.IntegerField(default=0)),
                ('created_date', models.DateTimeField(verbose_name='date created')),
                ('nft_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.nft')),
            ],
        ),
        migrations.CreateModel(
            name='MarketPlaceComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.CharField(max_length=500)),
                ('author_alias', models.CharField(max_length=50)),
                ('author_address', models.CharField(max_length=200)),
                ('up_votes', models.IntegerField(default=0)),
                ('down_votes', models.IntegerField(default=0)),
                ('tips', models.IntegerField(default=0)),
                ('token_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.nftmetadata')),
            ],
        ),
    ]
