// Usage: swift resize.swift <input> <output.png> <maxPixelSize>
// Prints "<width> <height>" of the written image.
import Foundation
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 4, let maxPixelSize = Int(args[3]) else {
  FileHandle.standardError.write("usage: resize.swift <input> <output.png> <maxPixelSize>\n".data(using: .utf8)!)
  exit(2)
}

let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])

guard let source = CGImageSourceCreateWithURL(input as CFURL, nil) else {
  FileHandle.standardError.write("cannot read \(input.path)\n".data(using: .utf8)!)
  exit(1)
}

let options: [CFString: Any] = [
  kCGImageSourceCreateThumbnailFromImageAlways: true,
  kCGImageSourceCreateThumbnailWithTransform: true,
  kCGImageSourceThumbnailMaxPixelSize: maxPixelSize,
]

guard let image = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary),
      let destination = CGImageDestinationCreateWithURL(output as CFURL, UTType.png.identifier as CFString, 1, nil)
else {
  FileHandle.standardError.write("cannot resize \(input.path)\n".data(using: .utf8)!)
  exit(1)
}

CGImageDestinationAddImage(destination, image, nil)
guard CGImageDestinationFinalize(destination) else {
  FileHandle.standardError.write("cannot write \(output.path)\n".data(using: .utf8)!)
  exit(1)
}

print("\(image.width) \(image.height)")
