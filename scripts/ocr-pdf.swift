import PDFKit
import Vision
import AppKit
import Foundation

// Renders each PDF page and OCRs it with Apple's Vision framework.
// Used to produce packages/database/prisma/ocr/{slug}.txt for image-based decks.
// usage: swift scripts/ocr-pdf.swift <pdf> [maxpages] > out.txt

let args = CommandLine.arguments
guard args.count >= 2 else {
    FileHandle.standardError.write("usage: ocr <pdf> [maxpages]\n".data(using: .utf8)!)
    exit(1)
}
let pdfPath = args[1]
let maxPages = args.count >= 3 ? (Int(args[2]) ?? 100) : 100

guard let doc = PDFDocument(url: URL(fileURLWithPath: pdfPath)) else {
    FileHandle.standardError.write("cannot open \(pdfPath)\n".data(using: .utf8)!)
    exit(1)
}

let count = min(doc.pageCount, maxPages)
for i in 0..<count {
    guard let page = doc.page(at: i) else { continue }
    let bounds = page.bounds(for: .mediaBox)
    let scale: CGFloat = 2.5
    let size = NSSize(width: bounds.width * scale, height: bounds.height * scale)
    let img = page.thumbnail(of: size, for: .mediaBox)

    guard let cgImage = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true

    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
        try handler.perform([request])
    } catch {
        FileHandle.standardError.write("OCR failed on page \(i + 1): \(error)\n".data(using: .utf8)!)
        continue
    }

    let lines = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }
    print("--- PAGE \(i + 1) ---")
    print(lines.joined(separator: "\n"))
}
