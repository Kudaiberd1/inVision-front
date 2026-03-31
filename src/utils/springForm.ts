import type { ApplicationFormData, StudentLevel } from '../types';
import { STUDENT_LEVELS } from '../constants';

/** HTML date input uses yyyy-MM-dd; Spring form binding expects MM/dd/yyyy. */
export function formatDateOfBirthForSpring(value: string): string {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const [, y, m, d] = iso;
    return `${m}/${d}/${y}`;
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) return value;
  return value;
}

export function fieldOfStudyLabelForSpring(level: StudentLevel): string {
  return STUDENT_LEVELS.find((o) => o.value === level)?.label ?? level;
}

/** Map Spring multipart field names to ApplicationFormPage error keys. */
export const SPRING_FIELD_TO_FORM: Record<string, string> = {
  schoolUniversity: 'school',
  motivationEssay: 'essay',
  introductionVideo: 'video',
};

export function mapSpringFieldErrors(
  server: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(server)) {
    out[SPRING_FIELD_TO_FORM[k] ?? k] = v;
  }
  return out;
}

/** Multipart for `POST /api/forms/{id}/submit` (not the draft endpoint). */
export function buildSpringApplicationFormData(data: ApplicationFormData): FormData {
  const form = new FormData();
  form.append('fullName', data.fullName.trim());
  form.append('email', data.email.trim());
  if (data.phone.trim()) {
    form.append('phone', data.phone.trim());
  }
  form.append('dateOfBirth', formatDateOfBirthForSpring(data.dateOfBirth));
  form.append('city', data.city.trim());
  form.append('schoolUniversity', data.school.trim());
  if (data.untScore.trim()) {
    form.append('unt_score', data.untScore.trim());
  }
  if (data.ielts.trim()) {
    form.append('IELTS', data.ielts.trim());
  }
  if (data.toefl.trim()) {
    form.append('TOEFL', data.toefl.trim());
  }
  const programName = data.program?.name?.trim();
  if (!programName) {
    throw new Error('Missing degree program for fieldOfStudy');
  }
  form.append('fieldOfStudy', programName);

  if (data.codeforces.trim()) {
    form.append('codeforces', data.codeforces.trim());
  }
  if (data.leetcode.trim()) {
    form.append('leetcode', data.leetcode.trim());
  }
  if (data.github.trim()) {
    form.append('github', data.github.trim());
  }
  if (data.linkedin.trim()) {
    form.append('linkedin', data.linkedin.trim());
  }

  if (!data.cvFile || !data.essayFile || !data.videoFile) {
    throw new Error('Missing required files');
  }
  form.append('cv', data.cvFile);
  form.append('motivationEssay', data.essayFile);
  form.append('introductionVideo', data.videoFile);

  return form;
}
