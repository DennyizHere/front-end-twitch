import pygame

from django.shortcuts import render

from catalog.models import emote, threshholdFlag

def index(request):
    if (threshholdFlag):
        pygame.mixer.init()
        pygame.mixer.music.load("audio.mp3")
        pygame.mixer.music.play()

    context = {
        'threshholdFlag':threshholdFlag,
    }

    return render(request, 'video_overlay.html', context=context)