import { Router } from 'express';
import { 
  getSpecifications, 
  createSpecification, 
  updateSpecification, 
  deleteSpecification,
  createSpecificationValue,
  deleteSpecificationValue,
  updateSpecificationValue
} from './controller';

const router = Router();

// --- Specifications ---
router.get('/', getSpecifications);
router.post('/', createSpecification);
router.put('/:id', updateSpecification);
router.delete('/:id', deleteSpecification);

// --- Specification Values ---
router.post('/:specificationId/values', createSpecificationValue);
router.put('/:specificationId/values/:valueId', updateSpecificationValue);
router.delete('/:specificationId/values/:valueId', deleteSpecificationValue);

export default router;
