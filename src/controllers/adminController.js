const { query } = require('../config/db');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Helper function to build UPDATE query
function buildUpdateQuery(table, updates, id) {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  return { sql, params: [...values, id] };
}

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Auth
async function login(req, res, next) {
  // Already in authController, but for admin
  const authController = require('./authController');
  return authController.login(req, res, next);
}

// Settings
async function getSettings(req, res, next) {
  try {
    const settings = await query('SELECT * FROM settings');
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const { id, ...updates } = req.body;
    const { sql, params } = buildUpdateQuery('settings', updates, id);
    await query(sql, params);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// Languages
async function getLanguages(req, res, next) {
  try {
    const languages = await query('SELECT * FROM languages');
    res.json(languages);
  } catch (err) {
    next(err);
  }
}

async function createLanguage(req, res, next) {
  try {
    const { code, name, is_default, is_active } = req.body;
    await query('INSERT INTO languages (code, name, is_default, is_active) VALUES (?, ?, ?, ?)', [code, name, is_default, is_active]);
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function updateLanguage(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { sql, params } = buildUpdateQuery('languages', updates, id);
    await query(sql, params);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function deleteLanguage(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM languages WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// UI Translations
async function getUiTranslations(req, res, next) {
  try {
    const translations = await query('SELECT * FROM ui_translations');
    res.json(translations);
  } catch (err) {
    next(err);
  }
}

async function createUiTranslation(req, res, next) {
  try {
    const { language_id, translation_key, translation_value, value_type } = req.body;
    await query('INSERT INTO ui_translations (language_id, translation_key, translation_value, value_type) VALUES (?, ?, ?, ?)', [language_id, translation_key, translation_value, value_type]);
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function updateUiTranslation(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { sql, params } = buildUpdateQuery('ui_translations', updates, id);
    await query(sql, params);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function deleteUiTranslation(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM ui_translations WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// Hero Sliders
async function getHeroSliders(req, res, next) {
  try {
    const sliders = await query('SELECT * FROM hero_sliders');
    res.json(sliders);
  } catch (err) {
    next(err);
  }
}

async function createHeroSlider(req, res, next) {
  try {
    const { title, subtitle, button_text, button_link, image, is_active } = req.body;
    await query(
      'INSERT INTO hero_sliders (title, subtitle, button_text, button_link, image, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, subtitle || null, button_text || null, button_link || null, image, is_active ?? 1]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function updateHeroSlider(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { sql, params } = buildUpdateQuery('hero_sliders', updates, id);
    await query(sql, params);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function deleteHeroSlider(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM hero_sliders WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// City Stats
async function getCityStats(req, res, next) {
  try {
    const stats = await query('SELECT * FROM city_stats ORDER BY order_number');
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

async function createCityStat(req, res, next) {
  try {
    const { stat_key, value, icon, order_number, is_active } = req.body;
    await query('INSERT INTO city_stats (stat_key, value, icon, order_number, is_active) VALUES (?, ?, ?, ?, ?)', [stat_key, value, icon, order_number, is_active]);
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function updateCityStat(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { sql, params } = buildUpdateQuery('city_stats', updates, id);
    await query(sql, params);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function deleteCityStat(req, res, next) {
  try {
    const { id } = req.params;
    // Delete related translations first to avoid foreign key constraint
    await query('DELETE FROM city_stat_translations WHERE stat_id = ?', [id]);
    await query('DELETE FROM city_stats WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// Departments
async function getDepartments(req, res, next) {
  try {
    const departments = await query('SELECT * FROM departments');
    res.json(departments);
  } catch (err) {
    next(err);
  }
}

async function createDepartment(req, res, next) {
  try {
    const { name, description, icon, is_active } = req.body;
    await query('INSERT INTO departments (name, description, icon, is_active) VALUES (?, ?, ?, ?)', [name, description, icon, is_active]);
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function updateDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { sql, params } = buildUpdateQuery('departments', updates, id);
    await query(sql, params);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function deleteDepartment(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM departments WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// Services
async function getServices(req, res, next) {
  try {
    const services = await query('SELECT * FROM services');
    res.json(services);
  } catch (err) {
    next(err);
  }
}

async function createService(req, res, next) {
  try {
    const { title, description, icon, link, is_active } = req.body;
    await query('INSERT INTO services (title, description, icon, link, is_active) VALUES (?, ?, ?, ?, ?)', [title, description, icon, link, is_active]);
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { sql, params } = buildUpdateQuery('services', updates, id);
    await query(sql, params);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    // Delete related translations first to avoid foreign key constraint
    await query('DELETE FROM service_translations WHERE service_id = ?', [id]);
    await query('DELETE FROM services WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// News
async function getNews(req, res, next) {
  try {
    const news = await query('SELECT * FROM news ORDER BY published_at DESC');
    res.json(news);
  } catch (err) {
    next(err);
  }
}

async function createNews(req, res, next) {
  try {
    const { title, content, featured_image, published_at, is_active } = req.body;
    await query('INSERT INTO news (title, content, featured_image, published_at, is_active) VALUES (?, ?, ?, ?, ?)', [title, content, featured_image, published_at, is_active]);
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function updateNews(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { sql, params } = buildUpdateQuery('news', updates, id);
    await query(sql, params);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function deleteNews(req, res, next) {
  try {
    const { id } = req.params;
    // Delete related records first to avoid foreign key constraint
    await query('DELETE FROM news_category_map WHERE news_id = ?', [id]);
    await query('DELETE FROM news WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// Subscribers
async function getSubscribers(req, res, next) {
  try {
    const subscribers = await query('SELECT * FROM subscribers');
    res.json(subscribers);
  } catch (err) {
    next(err);
  }
}

async function deleteSubscriber(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM subscribers WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// Newsletter
async function sendNewsletter(req, res, next) {
  try {
    const { subject, message, html, testEmail } = req.body || {};
    if (!subject || (!message && !html)) {
      return res.status(400).json({ error: "subject and message/html are required" });
    }

    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
      return res.status(400).json({
        error:
          "Email provider not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM on the backend.",
      });
    }

    const nodemailer = require("nodemailer");
    const secure = SMTP_PORT === 465;
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const toSendHtml = html || `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap">${String(message || "").replace(/</g, "&lt;")}</pre>`;
    const toSendText = message || "";

    const rows = testEmail
      ? [{ email: String(testEmail).trim().toLowerCase() }]
      : await query(
          "SELECT email FROM subscribers WHERE (status = 'active' OR status IS NULL) AND email IS NOT NULL"
        );

    const emails = rows
      .map((r) => (r && r.email ? String(r.email).trim().toLowerCase() : ""))
      .filter(Boolean);

    if (emails.length === 0) {
      return res.status(400).json({ error: "No active subscribers to send to" });
    }

    const chunkSize = 50;
    const chunks = [];
    for (let i = 0; i < emails.length; i += chunkSize) {
      chunks.push(emails.slice(i, i + chunkSize));
    }

    let sentCount = 0;
    for (const chunk of chunks) {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: SMTP_FROM,
        bcc: chunk,
        subject: String(subject),
        text: toSendText,
        html: toSendHtml,
      });
      sentCount += chunk.length;
    }

    return res.json({ success: true, sent: sentCount, testEmail: !!testEmail });
  } catch (err) {
    return next(err);
  }
}

// Contacts
async function getContacts(req, res, next) {
  try {
    const contacts = await query('SELECT * FROM contact_messages');
    res.json(contacts);
  } catch (err) {
    next(err);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// File upload
async function uploadFile(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (err) return next(err);
    res.json({ filePath: req.file.path });
  });
}

module.exports = {
  login,
  getSettings,
  updateSettings,
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  getUiTranslations,
  createUiTranslation,
  updateUiTranslation,
  deleteUiTranslation,
  getHeroSliders,
  createHeroSlider,
  updateHeroSlider,
  deleteHeroSlider,
  getCityStats,
  createCityStat,
  updateCityStat,
  deleteCityStat,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getServices,
  createService,
  updateService,
  deleteService,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  getSubscribers,
  deleteSubscriber,
  sendNewsletter,
  getContacts,
  deleteContact,
  uploadFile
};