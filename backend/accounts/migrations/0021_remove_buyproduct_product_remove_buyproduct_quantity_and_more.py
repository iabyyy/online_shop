# Generated by Django 5.0.6 on 2025-05-23 06:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0020_remove_buyproduct_cart_buyproduct_product_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='buyproduct',
            name='product',
        ),
        migrations.RemoveField(
            model_name='buyproduct',
            name='quantity',
        ),
        migrations.RemoveField(
            model_name='buyproduct',
            name='user',
        ),
        migrations.AddField(
            model_name='buyproduct',
            name='cart',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='accounts.cartitem'),
            preserve_default=False,
        ),
    ]
