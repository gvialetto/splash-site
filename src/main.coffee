colors = ["#6ecff5", "#a1cf64", "#d95c5c", "#564f8a", "#00b5ad", "#cc7722"]
avatar = document.getElementById "avatar"
text = document.getElementById "highlight"

# converts both rgb(x,y,z) and #xxyyzz color formats to hex. Needed because
# every browser return different things from getComputedStyle, and it also
# depends on the way the attribute itself was set...
color2hex = (color) ->
    color if /^#/.test(color)
    match = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    hex=parseInt(match[4])|parseInt(match[3])<<8|parseInt(match[2])<<16
    match[1]+"#"+hex.toString(16)

curColor = ->
    window.getComputedStyle(avatar,null).getPropertyValue "background-color"

switchColor = ->
    current = color2hex curColor()
    available = colors.filter (color)-> color isnt current
    randomPos = Math.floor Math.random() * available.length
    avatar.style.backgroundColor = available[randomPos]
    text.style.color = available[randomPos]
    return

document.addEventListener("DOMContentLoaded", (->
    switchColor()
    avatar.className = "final"
    text.className = "final"
    avatar.addEventListener "mouseenter", switchColor
    avatar.addEventListener "touchend", switchColor
    return
))