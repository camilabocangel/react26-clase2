import { test, expect } from '@playwright/test';

test('pantalla de inicio muestra el título y las instrucciones', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Duelo de Naves' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Jugar' })).toBeVisible();
});

test('al jugar, el backend crea la partida y muestra a ambos jugadores', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Jugar' }).click();

    await expect(page.getByText('Ronda 1')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Jugador 1' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Jugador 2' })).toBeVisible();
});

test('el juego avisa antes de intentar atacar sin energía, y el backend rechaza la acción', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Jugar' }).click();
    await expect(page.getByText('Ronda 1')).toBeVisible();

    // Ningún jugador tiene energía todavía: la interfaz ya avisa antes de elegir.
    await expect(page.getByText(/le faltan 30 para poder atacar/)).toBeVisible();

    // Si de todas formas se intenta atacar, el servidor lo rechaza y lo explica.
    await page.getByRole('button', { name: /^Atacar/ }).click();
    await page.getByRole('button', { name: /^Atacar/ }).click();

    await expect(page.getByText(/no tiene suficiente energía/)).toBeVisible();
});

test('una ronda válida se resuelve con el backend y actualiza la energía en pantalla', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Jugar' }).click();
    await expect(page.getByText('Ronda 1')).toBeVisible();

    await page.getByRole('button', { name: /^Cargar/ }).click();
    await page.getByRole('button', { name: /^Cargar/ }).click();

    await expect(page.getByText(/Jugador 1 carga energía\. Jugador 2 carga energía\./)).toBeVisible();
    await expect(page.getByText('Energía: 25/100').first()).toBeVisible();
});
