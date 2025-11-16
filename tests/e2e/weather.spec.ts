import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Weather PWA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Weather PWA/);
    await expect(page.locator('h1')).toContainText('Weather PWA');
  });

  test('should display initial welcome message', async ({ page }) => {
    await expect(page.locator('text=Bem-vindo ao Weather PWA')).toBeVisible();
    await expect(page.locator('text=Digite o nome de uma cidade')).toBeVisible();
  });

  test('should have search input and buttons', async ({ page }) => {
    await expect(page.locator('input[placeholder*="Digite o nome da cidade"]')).toBeVisible();
    await expect(page.locator('button:has-text("Buscar")')).toBeVisible();
    await expect(page.locator('button:has-text("Minha Localização")')).toBeVisible();
  });

  test('should search for a city and display weather data', async ({ page }) => {
    // Preencher o campo de busca
    const searchInput = page.locator('input[placeholder*="Digite o nome da cidade"]');
    await searchInput.fill('São Paulo');

    // Clicar no botão de busca
    await page.locator('button:has-text("Buscar")').click();

    // Aguardar o carregamento dos dados
    await page.waitForTimeout(2000);

    // Verificar se os dados do tempo foram exibidos
    await expect(page.locator('text=/São Paulo/i')).toBeVisible({ timeout: 10000 });
    
    // Verificar se a temperatura está visível
    await expect(page.locator('text=/°C/i').first()).toBeVisible();
    
    // Verificar se os cards de informações estão visíveis
    await expect(page.locator('text=Vento')).toBeVisible();
    await expect(page.locator('text=Umidade')).toBeVisible();
    await expect(page.locator('text=Pressão')).toBeVisible();
  });

  test('should display 5-day forecast', async ({ page }) => {
    // Buscar por uma cidade
    const searchInput = page.locator('input[placeholder*="Digite o nome da cidade"]');
    await searchInput.fill('Rio de Janeiro');
    await page.locator('button:has-text("Buscar")').click();

    // Aguardar carregamento
    await page.waitForTimeout(2000);

    // Verificar se a seção de previsão está visível
    await expect(page.locator('text=Previsão para os próximos dias')).toBeVisible({ timeout: 10000 });
    
    // Verificar se há pelo menos 3 cards de previsão (pode variar)
    const forecastCards = page.locator('[class*="grid"] > div[class*="border"]');
    await expect(forecastCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('should show error for invalid city', async ({ page }) => {
    // Buscar por uma cidade inválida
    const searchInput = page.locator('input[placeholder*="Digite o nome da cidade"]');
    await searchInput.fill('CidadeInvalidaQueNaoExiste123456');
    await page.locator('button:has-text("Buscar")').click();

    // Aguardar mensagem de erro
    await page.waitForTimeout(2000);
    
    // Verificar se a mensagem de erro aparece
    await expect(page.locator('text=/Cidade não encontrada|Erro/i')).toBeVisible({ timeout: 10000 });
  });

  test('should have PWA manifest', async ({ page }) => {
    // Verificar se o manifest está linkado
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest');
  });

  test('should register service worker', async ({ page, context }) => {
    // Aguardar um pouco para o service worker registrar
    await page.waitForTimeout(2000);

    // Verificar se o service worker foi registrado
    const serviceWorkerRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration !== undefined;
      }
      return false;
    });

    expect(serviceWorkerRegistered).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Definir viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Verificar se os elementos principais estão visíveis
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[placeholder*="Digite o nome da cidade"]')).toBeVisible();
    
    // Buscar por uma cidade
    const searchInput = page.locator('input[placeholder*="Digite o nome da cidade"]');
    await searchInput.fill('Brasília');
    await page.locator('button:has-text("Buscar")').click();

    // Aguardar carregamento
    await page.waitForTimeout(2000);

    // Verificar se os dados são exibidos corretamente no mobile
    await expect(page.locator('text=/Brasília/i')).toBeVisible({ timeout: 10000 });
  });
});
