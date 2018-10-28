from django.db import models

class MyModelName(models.Model):

    emote = models.CharField(max_length = 30, help_text = "Name of emote to be counted")
    threshholdFlag = models.BooleanField()



