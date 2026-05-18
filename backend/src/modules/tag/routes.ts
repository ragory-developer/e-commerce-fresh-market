import { Router } from 'express';
import { getTags, createTag, updateTag, deleteTag } from './controller';

const router = Router();

// Publicly readable tags
router.get('/', getTags);

// Temporarily unprotected for admin UI building, just like category and brand routes
router.post('/', createTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
