import Cocoa

// Convert all hex colors passed as arguments (batch mode)
for hex in CommandLine.arguments.dropFirst() {
    let r = Double(Int(hex.prefix(2), radix: 16)!) / 255.0
    let g = Double(Int(hex.dropFirst(2).prefix(2), radix: 16)!) / 255.0
    let b = Double(Int(hex.dropFirst(4).prefix(2), radix: 16)!) / 255.0

    let srgbColor = NSColor(srgbRed: CGFloat(r), green: CGFloat(g), blue: CGFloat(b), alpha: 1.0)
    let genericColor = srgbColor.usingColorSpace(.genericRGB)!

    print("\(hex) \(genericColor.redComponent) \(genericColor.greenComponent) \(genericColor.blueComponent)")
}
