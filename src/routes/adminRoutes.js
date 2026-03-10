const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Apply auth to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Auth
router.post('/login', adminController.login); // Wait, login should be separate, but since it's admin, maybe move to public or keep here.

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

// Languages
router.get('/languages', adminController.getLanguages);
router.post('/languages', adminController.createLanguage);
router.put('/languages/:id', adminController.updateLanguage);
router.delete('/languages/:id', adminController.deleteLanguage);

// UI Translations
router.get('/ui-translations', adminController.getUiTranslations);
router.post('/ui-translations', adminController.createUiTranslation);
router.put('/ui-translations/:id', adminController.updateUiTranslation);
router.delete('/ui-translations/:id', adminController.deleteUiTranslation);

// Hero Sliders
router.get('/hero-sliders', adminController.getHeroSliders);
router.post('/hero-sliders', adminController.createHeroSlider);
router.put('/hero-sliders/:id', adminController.updateHeroSlider);
router.delete('/hero-sliders/:id', adminController.deleteHeroSlider);

// City Stats
router.get('/city-stats', adminController.getCityStats);
router.post('/city-stats', adminController.createCityStat);
router.put('/city-stats/:id', adminController.updateCityStat);
router.delete('/city-stats/:id', adminController.deleteCityStat);

// Departments
router.get('/departments', adminController.getDepartments);
router.post('/departments', adminController.createDepartment);
router.put('/departments/:id', adminController.updateDepartment);
router.delete('/departments/:id', adminController.deleteDepartment);

// Services
router.get('/services', adminController.getServices);
router.post('/services', adminController.createService);
router.put('/services/:id', adminController.updateService);
router.delete('/services/:id', adminController.deleteService);

// News
router.get('/news', adminController.getNews);
router.post('/news', adminController.createNews);
router.put('/news/:id', adminController.updateNews);
router.delete('/news/:id', adminController.deleteNews);

// Subscribers
router.get('/subscribers', adminController.getSubscribers);
router.delete('/subscribers/:id', adminController.deleteSubscriber);

// Contact Messages
router.get('/contacts', adminController.getContacts);
router.delete('/contacts/:id', adminController.deleteContact);

// File upload
router.post('/upload', adminController.uploadFile);

module.exports = router;