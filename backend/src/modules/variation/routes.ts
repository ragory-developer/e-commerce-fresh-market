import { Router } from 'express';
import { 
  getVariations, 
  createVariation, 
  updateVariation, 
  deleteVariation,
  createVariationValue,
  deleteVariationValue,
  updateVariationValue
} from './controller';

const router = Router();

// --- Variations ---
router.get('/', getVariations);
router.post('/', createVariation);
router.put('/:id', updateVariation);
router.delete('/:id', deleteVariation);

// --- Variation Values ---
router.post('/:variationId/values', createVariationValue);
router.put('/:variationId/values/:valueId', updateVariationValue);
router.delete('/:variationId/values/:valueId', deleteVariationValue);

export default router;
