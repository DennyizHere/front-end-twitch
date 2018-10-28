from django.db import models

# Create your models here.
class Emotes(models.Model):

        emote = models.CharField(max_length = 30, help_text = "Name of emote to be counted")
            threshholdFlag = models.BooleanField()
