# Generated by Django 3.2 on 2021-05-15 01:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_rename_createat_review_createdat'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='numReview',
            new_name='numReviews',
        ),
    ]