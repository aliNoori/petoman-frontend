# دانلود فایل‌های مدل face-api.js

$modelUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
$modelsDir = "public/models"

# ساخت پوشه models
if (!(Test-Path $modelsDir)) {
    New-Item -ItemType Directory -Path $modelsDir
    Write-Host "✅ Created models directory"
}

# لیست فایل‌های مورد نیاز
$files = @(
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1"
)

Write-Host "📥 Downloading face-api.js model files..."

foreach ($file in $files) {
    $url = "$modelUrl/$file"
    $output = Join-Path $modelsDir $file
    
    try {
        Write-Host "Downloading $file..."
        Invoke-WebRequest -Uri $url -OutFile $output
        Write-Host "✅ $file"
    } catch {
        Write-Host "❌ Failed to download $file"
        Write-Host $_.Exception.Message
    }
}

Write-Host ""
Write-Host "✅ Model files downloaded to $modelsDir"
Write-Host "🚀 You can now use face detection in your app"
