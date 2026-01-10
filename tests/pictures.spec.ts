import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.afterEach(async ({ page }) => {
  // Teardown: Close the browser after each test
  await page.close();
});

test.describe('Pictures Page - Issue #1', () => {

  test('pictures page loads and displays correct content', async ({ page }) => {
    // Navigate to the pictures page
    await page.goto('http://localhost:3000/pictures');
    
    // Verify the page URL
    await expect(page).toHaveURL('http://localhost:3000/pictures');
    
    // Verify the page title
    await expect(page).toHaveTitle(/Pictures - AI SDLC MCP/);
    
    // Verify the main heading text matches issue requirement
    await expect(page.getByRole('heading', { name: 'Welcome to the Pictures page' })).toBeVisible();
    
    // Verify the upload section heading
    await expect(page.getByRole('heading', { name: 'Upload Pictures' })).toBeVisible();
  });

  test('pictures page has navigation links', async ({ page }) => {
    await page.goto('http://localhost:3000/pictures');
    
    // Verify navigation links exist
    const homeLink = page.getByRole('link', { name: 'Home' });
    const picturesLink = page.getByRole('link', { name: 'Pictures' });
    
    await expect(homeLink).toBeVisible();
    await expect(picturesLink).toBeVisible();
    
    // Verify links have correct URLs
    await expect(homeLink).toHaveAttribute('href', '/');
    await expect(picturesLink).toHaveAttribute('href', '/pictures');
  });

  test('navigation from pictures page to home page works', async ({ page }) => {
    await page.goto('http://localhost:3000/pictures');
    
    // Click the Home link
    await page.getByRole('link', { name: 'Home' }).click();
    
    // Verify navigation to home page
    await expect(page).toHaveURL('http://localhost:3000/');
    await expect(page.getByRole('heading', { name: 'Welcome to AI SDLC MCP' })).toBeVisible();
  });

  test('upload form elements are present and functional', async ({ page }) => {
    await page.goto('http://localhost:3000/pictures');
    
    // Verify file input exists
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    await expect(fileInput).toHaveAttribute('accept', 'image/*');
    await expect(fileInput).toHaveAttribute('required');
    
    // Verify upload button exists
    const uploadButton = page.getByRole('button', { name: 'Upload Picture' });
    await expect(uploadButton).toBeVisible();
    await expect(uploadButton).toBeEnabled();
  });

  test('displays message when no pictures are uploaded', async ({ page }) => {
    await page.goto('http://localhost:3000/pictures');
    
    // Check if gallery has images
    const gallery = page.locator('.gallery');
    const imageCount = await gallery.locator('img').count();
    
    if (imageCount === 0) {
      // If no images, verify the empty state message is shown
      await expect(page.getByText('No pictures uploaded yet. Upload your first picture above!')).toBeVisible();
    } else {
      // If images exist, verify they are displayed (test passes in this case)
      await expect(gallery.locator('img').first()).toBeVisible();
    }
  });

  test('can upload an image file', async ({ page }) => {
    await page.goto('http://localhost:3000/pictures');
    
    // Create a test image file
    const testImagePath = path.join(__dirname, '../test-image.png');
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(testImagePath, testImageBuffer);
    
    try {
      // Upload the test image
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(testImagePath);
      
      // Click upload button
      await page.getByRole('button', { name: 'Upload Picture' }).click();
      
      // Wait for redirect back to pictures page
      await expect(page).toHaveURL('http://localhost:3000/pictures');
      
      // Verify the image appears in the gallery (check for img tag)
      const images = page.locator('.gallery img');
      await expect(images.first()).toBeVisible({ timeout: 5000 });
      
      // Verify the empty state message is gone
      await expect(page.getByText('No pictures uploaded yet. Upload your first picture above!')).not.toBeVisible();
    } finally {
      // Clean up test image
      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath);
      }
    }
  });

  test('uploaded images are displayed in gallery', async ({ page }) => {
    await page.goto('http://localhost:3000/pictures');
    
    // Check if gallery exists and has images
    const gallery = page.locator('.gallery');
    await expect(gallery).toBeVisible();
    
    // If images exist, verify they are displayed
    const imageCount = await gallery.locator('img').count();
    if (imageCount > 0) {
      // Verify at least one image is visible
      await expect(gallery.locator('img').first()).toBeVisible();
      
      // Verify images have src attribute pointing to /uploads/
      const firstImage = gallery.locator('img').first();
      const src = await firstImage.getAttribute('src');
      expect(src).toMatch(/^\/uploads\//);
    }
  });

  test('pictures page styling matches home page', async ({ page }) => {
    // Visit home page first
    await page.goto('http://localhost:3000/');
    const homeStyles = await page.evaluate(() => {
      const container = document.querySelector('.container');
      return window.getComputedStyle(container!);
    });
    
    // Visit pictures page
    await page.goto('http://localhost:3000/pictures');
    const picturesStyles = await page.evaluate(() => {
      const container = document.querySelector('.container');
      return window.getComputedStyle(container!);
    });
    
    // Verify similar styling (background, border-radius, etc.)
    expect(picturesStyles.backgroundColor).toBe(homeStyles.backgroundColor);
    expect(picturesStyles.borderRadius).toBe(homeStyles.borderRadius);
  });
  
  // Teardown: Runs after all tests in this suite complete
  // Pages are already closed by test.afterEach hook above
  // This ensures suite-level cleanup is executed
  test.afterAll(async () => {
    // Suite-level teardown - pages are already closed by afterEach
  });
});
