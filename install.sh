#!/bin/bash

THEME_DIR="$HOME/Library/Developer/Xcode/UserData/FontAndColorThemes"
FONT_DIR="$HOME/Library/Fonts"
REPO="https://raw.githubusercontent.com/ayu-theme/ayu-xcode/master"

install_fonts=""

for arg in "$@"; do
  case $arg in
    --with-fonts) install_fonts="yes" ;;
    --no-fonts) install_fonts="no" ;;
  esac
done

if [ -z "$install_fonts" ]; then
  printf "Install fonts? [Y/n] "
  read -r answer
  case $answer in
    [Nn]*) install_fonts="no" ;;
    *) install_fonts="yes" ;;
  esac
fi

mkdir -p "$THEME_DIR"

for variant in Light Dark Mirage; do
  curl -fsSL "$REPO/Ayu%20$variant.xccolortheme" -o "$THEME_DIR/Ayu $variant.xccolortheme"
  echo "Installed Ayu $variant"
done

if [ "$install_fonts" = "yes" ]; then
  for font in Regular Italic SemiBold SemiBoldItalic; do
    curl -fsSL "$REPO/fonts/Iosevka-$font.ttf" -o "$FONT_DIR/Iosevka-$font.ttf"
  done
  echo "Installed fonts"
fi

echo "Done. Restart Xcode and select the theme in Preferences > Themes."
