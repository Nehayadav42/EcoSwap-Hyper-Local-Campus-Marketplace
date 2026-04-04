const express = require('express');
const mongoose = require('mongoose');
const { requireAuth } = require('../middleware/requireAuth');
const Item = require('../models/Item');
const User = require('../models/User');

const router = express.Router();

async function attachSellerMeta(items, { revealPhone }) {
  const emails = [...new Set(items.map(i => i.sellerEmail).filter(Boolean))];
  if (emails.length === 0) {
    return items.map(i => ({
      ...i,
      sellerDisplayName: 'Seller',
      sellerCollege: '',
      hasSellerContact: false
    }));
  }

  const users = await User.find({ email: { $in: emails } })
    .select('email firstName lastName college phone')
    .lean();
  const byEmail = Object.fromEntries(users.map(u => [u.email, u]));

  return items.map(i => {
    const u = byEmail[i.sellerEmail];
    const fullName = u && `${u.firstName || ''} ${u.lastName || ''}`.trim();
    const sellerDisplayName = fullName || (i.sellerEmail || '').split('@')[0] || 'Seller';
    const sellerCollege = u?.college || '';
    const listingPhone = i.contactPhone && String(i.contactPhone).trim();
    const profilePhone = u?.phone && String(u.phone).trim();
    const hasSellerContact = Boolean(listingPhone || profilePhone);
    const base = {
      ...i,
      sellerDisplayName,
      sellerCollege,
      hasSellerContact
    };
    if (revealPhone) {
      base.sellerContactPhone = listingPhone || profilePhone || null;
    }
    return base;
  });
}

router.get('/', async (_req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).limit(100).lean();
    const enriched = await attachSellerMeta(items, { revealPhone: false });
    return res.json(enriched);
  } catch (e) {
    return next(e);
  }
});

router.get('/mine', requireAuth(), async (req, res, next) => {
  try {
    const email = String(req.user.sub).toLowerCase();
    const user = await User.findOne({ email }).select('_id').lean();
    const or = [{ sellerEmail: email }];
    if (user?._id) {
      or.push({ seller: user._id });
      or.push({ userId: user._id });
      or.push({ sellerId: user._id });
    }
    const items = await Item.find({ $or: or }).sort({ createdAt: -1 }).lean();
    return res.json(items);
  } catch (e) {
    return next(e);
  }
});

router.post('/', requireAuth(), async (req, res, next) => {
  try {
    const { title, price, condition, isNegotiable, description, contactPhone } = req.body || {};
    const sellerEmail = String(req.user.sub).toLowerCase();

    if (!title || String(title).trim() === '') {
      return res.status(400).json({ error: 'Title is required.' });
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: 'Valid price is required.' });
    }

    const phone =
      contactPhone !== undefined && contactPhone !== null ? String(contactPhone).trim() : '';

    const doc = await Item.create({
      title: String(title).trim(),
      price: priceNum,
      condition: condition || 'Good',
      isNegotiable: Boolean(isNegotiable),
      description: String(description || ''),
      sellerEmail,
      contactPhone: phone
    });

    return res.status(201).json(doc);
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', requireAuth(), async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid listing id.' });
    }

    const item = await Item.findById(id).lean();
    if (!item) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    const me = String(req.user.sub).toLowerCase();
    const [enriched] = await attachSellerMeta([item], { revealPhone: true });
    return res.json({
      ...enriched,
      isOwnListing: item.sellerEmail === me
    });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
