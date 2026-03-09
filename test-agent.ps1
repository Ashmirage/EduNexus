# EduNexus Agent 测试脚本 (PowerShell)

Write-Host "🚀 EduNexus Agent 功能测试" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$BaseUrl = "http://localhost:3000"
$Passed = 0
$Failed = 0

function Test-API {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [string]$Data = $null
    )

    Write-Host "测试: $Name ... " -NoNewline

    try {
        $uri = "$BaseUrl$Endpoint"

        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $uri -Method Get -ErrorAction Stop
        } else {
            $headers = @{ "Content-Type" = "application/json" }
            $response = Invoke-RestMethod -Uri $uri -Method Post -Body $Data -Headers $headers -ErrorAction Stop
        }

        Write-Host "✓ 通过" -ForegroundColor Green
        $script:Passed++
        return $true
    }
    catch {
        Write-Host "✗ 失败" -ForegroundColor Red
        Write-Host "  错误: $($_.Exception.Message)" -ForegroundColor Red
        $script:Failed++
        return $false
    }
}

Write-Host "1. 测试 ModelScope API 连接"
Write-Host "----------------------------"
Test-API -Name "ModelScope 连接测试" -Method "GET" -Endpoint "/api/test/modelscope"
Write-Host ""

Write-Host "2. 测试模型列表获取"
Write-Host "----------------------------"
Test-API -Name "获取模型列表" -Method "GET" -Endpoint "/api/models/list"
Write-Host ""

Write-Host "3. 测试 Agent 对话"
Write-Host "----------------------------"
$chatData = @{
    message = "你好，这是一个测试"
    history = @()
    config = @{
        socraticMode = $false
        temperature = 0.3
        maxIterations = 3
    }
} | ConvertTo-Json -Depth 10

Test-API -Name "Agent 标准对话" -Method "POST" -Endpoint "/api/workspace/agent/chat" -Data $chatData
Write-Host ""

Write-Host "4. 测试苏格拉底模式"
Write-Host "----------------------------"
$socraticData = @{
    message = "什么是机器学习？"
    history = @()
    config = @{
        socraticMode = $true
        temperature = 0.7
        maxIterations = 5
    }
} | ConvertTo-Json -Depth 10

Test-API -Name "苏格拉底模式对话" -Method "POST" -Endpoint "/api/workspace/agent/chat" -Data $socraticData
Write-Host ""

Write-Host "5. 测试知识库 AI"
Write-Host "----------------------------"
$kbData = @{
    documentTitle = "测试文档"
    documentContent = "这是一个测试文档的内容"
    userInput = "请总结这个文档"
    conversationHistory = @()
} | ConvertTo-Json -Depth 10

Test-API -Name "知识库 AI 助手" -Method "POST" -Endpoint "/api/kb/ai/chat" -Data $kbData
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "测试结果汇总" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "通过: $Passed" -ForegroundColor Green
Write-Host "失败: $Failed" -ForegroundColor Red
Write-Host "总计: $($Passed + $Failed)"
Write-Host ""

if ($Failed -eq 0) {
    Write-Host "✓ 所有测试通过！" -ForegroundColor Green
    exit 0
} else {
    Write-Host "✗ 有 $Failed 个测试失败" -ForegroundColor Red
    exit 1
}
