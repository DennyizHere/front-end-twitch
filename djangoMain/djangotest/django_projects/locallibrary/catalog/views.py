#from django.shortcuts import render

# Create your views here
import pygame

from django.shortcuts import render

from catalog.models import Emotes

def index(request):
    if (Emotes.threshholdFlag):
        pygame.mixer.init()
        pygame.mixer.music.load("audio.mp3")
        pygame.mixer.music.play()

    threshholdFlag = Emotes.threshholdFlag

    context = {
        'threshholdFlag':threshholdFlag,
    }

    return render(request, 'video_overlay.html', context=context).
