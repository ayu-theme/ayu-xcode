import * as ayu from 'ayu'
import { Color } from 'ayu/color'
import { execSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

export type SchemeName = 'light' | 'dark' | 'mirage'

const __dirname = dirname(fileURLToPath(import.meta.url))
const swiftScript = join(__dirname, 'convert-color.swift')

// Cache for color conversions (populated by convertColors)
let colorCache = new Map<string, [number, number, number]>()

// Batch convert all hex colors in a single Swift call
const convertColors = (hexColors: string[]) => {
  if (hexColors.length === 0) return
  const result = execSync(`swift "${swiftScript}" ${hexColors.join(' ')}`, { encoding: 'utf-8' })
  for (const line of result.trim().split('\n')) {
    const [hex, r, g, b] = line.split(' ')
    colorCache.set(hex, [Number(r), Number(g), Number(b)])
  }
}

// Get converted color from cache
const srgbToGenericRgb = (hex: string): [number, number, number] => {
  const cached = colorCache.get(hex)
  if (!cached) throw new Error(`Color ${hex} not pre-converted`)
  return cached
}

const rgba = (color: Color) => {
  const hex = color.hex().replace('#', '').toUpperCase().slice(0, 6)
  const [r, g, b] = srgbToGenericRgb(hex)
  const a = color.getAlpha()
  return `${r} ${g} ${b} ${a}`
}

// Collect all unique hex colors from a scheme
const collectColors = (scheme: typeof ayu.light): string[] => {
  const colors = new Set<string>()
  const addColor = (c: Color) => colors.add(c.hex().replace('#', '').toUpperCase().slice(0, 6))

  // Common
  addColor(scheme.common.accent.tint)
  addColor(scheme.common.error)

  // Syntax
  addColor(scheme.syntax.tag)
  addColor(scheme.syntax.func)
  addColor(scheme.syntax.entity)
  addColor(scheme.syntax.string)
  addColor(scheme.syntax.regexp)
  addColor(scheme.syntax.markup)
  addColor(scheme.syntax.keyword)
  addColor(scheme.syntax.special)
  addColor(scheme.syntax.comment)
  addColor(scheme.syntax.constant)
  addColor(scheme.syntax.operator)

  // Editor
  addColor(scheme.editor.fg)
  addColor(scheme.editor.bg)
  addColor(scheme.editor.line)
  addColor(scheme.editor.selection.active)

  // UI
  addColor(scheme.ui.line)
  addColor(scheme.ui.fg)

  // VCS
  addColor(scheme.vcs.modified)

  return [...colors]
}

export default (variant: SchemeName) => {
  const scheme = ayu[variant]

  // Pre-convert all colors in a single Swift call
  colorCache = new Map()
  convertColors(collectColors(scheme))

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>DVTConsoleDebuggerInputTextColor</key>
		<string>${rgba(scheme.common.accent.tint)}</string>

		<key>DVTConsoleDebuggerInputTextFont</key>
		<string>Iosevka-Semibold - 13.5</string>

		<key>DVTConsoleDebuggerOutputTextColor</key>
		<string>${rgba(scheme.syntax.comment)}</string>

		<key>DVTConsoleDebuggerOutputTextFont</key>
		<string>Iosevka - 13.5</string>

		<key>DVTConsoleDebuggerPromptTextColor</key>
		<string>${rgba(scheme.syntax.tag)}</string>

		<key>DVTConsoleDebuggerPromptTextFont</key>
		<string>Iosevka-Semibold - 13.5</string>

		<key>DVTConsoleExectuableInputTextColor</key>
		<string>${rgba(scheme.common.accent.tint)}</string>

		<key>DVTConsoleExectuableInputTextFont</key>
		<string>Iosevka - 13.5</string>

		<key>DVTConsoleExectuableOutputTextColor</key>
		<string>${rgba(scheme.syntax.comment)}</string>

		<key>DVTConsoleExectuableOutputTextFont</key>
		<string>Iosevka-Semibold - 13.5</string>

		<key>DVTConsoleTextBackgroundColor</key>
		<string>${rgba(scheme.editor.bg)}</string>

		<key>DVTConsoleTextInsertionPointColor</key>
		<string>${rgba(scheme.common.accent.tint)}</string>

		<key>DVTConsoleTextSelectionColor</key>
		<string>${rgba(scheme.editor.selection.active)}</string>

		<key>DVTFontAndColorVersion</key>
		<integer>1</integer>

		<key>DVTFontSizeModifier</key>
		<integer>1</integer>

		<key>DVTMarkupTextBackgroundColor</key>
		<string>0.96 0.96 0.96 1</string>

		<key>DVTMarkupTextBorderColor</key>
		<string>0.8832 0.8832 0.8832 1</string>

		<key>DVTMarkupTextCodeFont</key>
		<string>SFMono-Regular - 11.0</string>

		<key>DVTMarkupTextEmphasisColor</key>
		<string>0 0 0 1</string>

		<key>DVTMarkupTextEmphasisFont</key>
		<string>.SFNS-RegularItalic - 12.0</string>

		<key>DVTMarkupTextInlineCodeColor</key>
		<string>0 0 0 0.7</string>

		<key>DVTMarkupTextLinkColor</key>
		<string>0.055 0.055 1 1</string>

		<key>DVTMarkupTextLinkFont</key>
		<string>.SFNS-Regular - 12.0</string>

		<key>DVTMarkupTextNormalColor</key>
		<string>0 0 0 1</string>

		<key>DVTMarkupTextNormalFont</key>
		<string>.SFNS-Regular - 12.0</string>

		<key>DVTMarkupTextOtherHeadingColor</key>
		<string>0 0 0 0.5</string>

		<key>DVTMarkupTextOtherHeadingFont</key>
		<string>.SFNS-Regular - 16.8</string>

		<key>DVTMarkupTextPrimaryHeadingColor</key>
		<string>0 0 0 1</string>

		<key>DVTMarkupTextPrimaryHeadingFont</key>
		<string>.SFNS-Regular - 28.8</string>

		<key>DVTMarkupTextSecondaryHeadingColor</key>
		<string>0 0 0 1</string>

		<key>DVTMarkupTextSecondaryHeadingFont</key>
		<string>.SFNS-Regular - 21.6</string>

		<key>DVTMarkupTextStrongColor</key>
		<string>0 0 0 1</string>

		<key>DVTMarkupTextStrongFont</key>
		<string>.SFNS-Bold - 12.0</string>

		<key>DVTScrollbarMarkerAnalyzerColor</key>
		<string>0.403922 0.372549 1 1</string>

		<key>DVTScrollbarMarkerBreakpointColor</key>
		<string>0.290196 0.290196 0.968627 1</string>

		<key>DVTScrollbarMarkerDiffColor</key>
		<string>${rgba(scheme.vcs.modified)}</string>

		<key>DVTScrollbarMarkerDiffConflictColor</key>
		<string>${rgba(scheme.common.error)}</string>

		<key>DVTScrollbarMarkerErrorColor</key>
		<string>${rgba(scheme.common.error)}</string>

		<key>DVTScrollbarMarkerRuntimeIssueColor</key>
		<string>0.643137 0.509804 1 1</string>

		<key>DVTScrollbarMarkerWarningColor</key>
		<string>${rgba(scheme.syntax.func)}</string>

		<key>DVTSourceTextBackground</key>
		<string>${rgba(scheme.editor.bg)}</string>

		<key>DVTSourceTextBlockDimBackgroundColor</key>
		<string>0.424672 0.424672 0.424672 1</string>

		<key>DVTSourceTextCurrentLineHighlightColor</key>
		<string>${rgba(scheme.editor.line)}</string>

		<key>DVTSourceTextInsertionPointColor</key>
		<string>${rgba(scheme.common.accent.tint)}</string>

		<key>DVTSourceTextInvisiblesColor</key>
		<string>${rgba(scheme.ui.line)}</string>

		<key>DVTSourceTextSelectionColor</key>
		<string>${rgba(scheme.editor.selection.active)}</string>

		<key>DVTSourceTextSyntaxColors</key>
		<dict>
			<key>xcode.syntax.attribute</key>
			<string>${rgba(scheme.syntax.tag)}</string>

			<key>xcode.syntax.character</key>
			<string>${rgba(scheme.syntax.constant)}</string>

			<key>xcode.syntax.comment</key>
			<string>${rgba(scheme.syntax.comment)}</string>

			<key>xcode.syntax.comment.doc</key>
			<string>${rgba(scheme.syntax.markup)}</string>

			<key>xcode.syntax.comment.doc.keyword</key>
			<string>${rgba(scheme.syntax.keyword)}</string>

			<key>xcode.syntax.declaration.other</key>
			<string>${rgba(scheme.syntax.func)}</string>

			<key>xcode.syntax.declaration.type</key>
			<string>${rgba(scheme.syntax.entity)}</string>

			<key>xcode.syntax.identifier.class</key>
			<string>${rgba(scheme.syntax.entity)}</string>

			<key>xcode.syntax.identifier.class.system</key>
			<string>${rgba(scheme.syntax.tag)}</string>

			<key>xcode.syntax.identifier.constant</key>
			<string>${rgba(scheme.syntax.constant)}</string>

			<key>xcode.syntax.identifier.constant.system</key>
			<string>${rgba(scheme.syntax.tag)}</string>

			<key>xcode.syntax.identifier.function</key>
			<string>${rgba(scheme.syntax.func)}</string>

			<key>xcode.syntax.identifier.function.system</key>
			<string>${rgba(scheme.syntax.special)}</string>

			<key>xcode.syntax.identifier.macro</key>
			<string>${rgba(scheme.syntax.special)}</string>

			<key>xcode.syntax.identifier.macro.system</key>
			<string>${rgba(scheme.syntax.special)}</string>

			<key>xcode.syntax.identifier.type</key>
			<string>${rgba(scheme.syntax.entity)}</string>

			<key>xcode.syntax.identifier.type.system</key>
			<string>${rgba(scheme.syntax.tag)}</string>

			<key>xcode.syntax.identifier.variable</key>
			<string>${rgba(scheme.editor.fg)}</string>

			<key>xcode.syntax.identifier.variable.system</key>
			<string>${rgba(scheme.syntax.tag)}</string>

			<key>xcode.syntax.keyword</key>
			<string>${rgba(scheme.syntax.keyword)}</string>

			<key>xcode.syntax.mark</key>
			<string>${rgba(scheme.editor.fg)}</string>

			<key>xcode.syntax.markup.code</key>
			<string>${rgba(scheme.syntax.markup)}</string>

			<key>xcode.syntax.number</key>
			<string>${rgba(scheme.syntax.constant)}</string>

			<key>xcode.syntax.plain</key>
			<string>${rgba(scheme.editor.fg)}</string>

			<key>xcode.syntax.preprocessor</key>
			<string>${rgba(scheme.syntax.special)}</string>

			<key>xcode.syntax.regex</key>
			<string>${rgba(scheme.syntax.regexp)}</string>

			<key>xcode.syntax.regex.capturename</key>
			<string>${rgba(scheme.syntax.constant)}</string>

			<key>xcode.syntax.regex.charname</key>
			<string>${rgba(scheme.syntax.tag)}</string>

			<key>xcode.syntax.regex.number</key>
			<string>${rgba(scheme.syntax.constant)}</string>

			<key>xcode.syntax.regex.other</key>
			<string>${rgba(scheme.syntax.regexp)}</string>

			<key>xcode.syntax.string</key>
			<string>${rgba(scheme.syntax.string)}</string>

			<key>xcode.syntax.url</key>
			<string>${rgba(scheme.syntax.string)}</string>
		</dict>

		<key>DVTSourceTextSyntaxFonts</key>
		<dict>
			<key>xcode.syntax.attribute</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.character</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.comment</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.comment.doc</key>
			<string>HelveticaNeue - 13.5</string>

			<key>xcode.syntax.comment.doc.keyword</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.declaration.other</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.declaration.type</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.class</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.class.system</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.constant</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.constant.system</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.function</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.function.system</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.macro</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.macro.system</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.type</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.type.system</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.variable</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.identifier.variable.system</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.keyword</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.mark</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.markup.code</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.number</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.plain</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.preprocessor</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.regex</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.regex.capturename</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.regex.charname</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.regex.number</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.regex.other</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.string</key>
			<string>Iosevka - 13.5</string>

			<key>xcode.syntax.url</key>
			<string>Iosevka - 13.5</string>
		</dict>
	</dict>
</plist>`
}
