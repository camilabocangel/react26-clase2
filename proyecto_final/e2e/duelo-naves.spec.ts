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
    await expect(page.getByRole('heading', { name: /Jugador 1/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Jugador 2/ })).toBeVisible();
});

test('se puede atacar desde la ronda 1 y, tras gastar toda la energía, el backend rechaza un nuevo ataque', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Jugar' }).click();
    await expect(page.getByText('Ronda 1')).toBeVisible();

    // Ambos jugadores empiezan con energía suficiente: no debería haber aviso todavía.
    await expect(page.getByText(/le faltan/)).toHaveCount(0);

    // Ambos atacan: gastan toda su energía inicial.
    await page.getByRole('button', { name: /Atacar/ }).click();
    await page.getByRole('button', { name: /Atacar/ }).click();
    await expect(page.getByText(/ataca e inflige/)).toBeVisible();
    await expect(page.getByText('Ronda 2')).toBeVisible();

    // Ahora sin energía: la interfaz avisa antes de elegir...
    await expect(page.getByText(/le faltan 20 para poder atacar/)).toBeVisible();

    // ...y si igual se intenta, el servidor lo rechaza.
    await page.getByRole('button', { name: /Atacar/ }).click();
    await page.getByRole('button', { name: /Atacar/ }).click();
    await expect(page.getByText(/no tiene suficiente energía/)).toBeVisible();
});

test('una ronda de carga se resuelve con el backend y actualiza la energía en pantalla', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Jugar' }).click();
    await expect(page.getByText('Ronda 1')).toBeVisible();

    await page.getByRole('button', { name: /Cargar/ }).click();
    await page.getByRole('button', { name: /Cargar/ }).click();

    await expect(page.getByText(/Jugador 1 carga energía\. Jugador 2 carga energía\./)).toBeVisible();
    // Energía inicial (20) + lo que da cargar (25) = 45.
    await expect(page.getByText('Energía: 45/100').first()).toBeVisible();
});
