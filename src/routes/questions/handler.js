import { Op } from 'sequelize';
import { Question, Answer, Category, AnsweredQuestion, Report } from '../../models';
import { createError, containsDuplicates } from '../../util';
import { questionNotFound, categoryNotFound } from '../../commonErrors';

export async function getQuestions(searchTerm) {
  const query = { attributes: ['id', 'text', 'CategoryId'] };

  if (searchTerm) {
    query.where = { text: { [Op.like]: `%${searchTerm}%` }, };
  }

  const questions = Question.findAll(query);
  return questions;
}

export async function createQuestion(text, categoryId, answers) {
  // Make sure that the category exists
  const category = await Category.findById(categoryId);
  if (!category) {
    throw categoryNotFound;
  }

  // Make sure none of the provided answer texts are the same
  if (containsDuplicates(answers.map(a => a.text))) {
    throw createError('Your request contains duplicate answer texts', 400);
  }

  // Make sure that there is no other question with the same text
  const dbQuestion = await Question.findOne({ where: { text } });
  if (dbQuestion) {
    throw createError('A question with the same text already exists', 400);
  }

  // the answers array has to contain exactly one correct answer
  const count = answers.reduce((curr, a) => a.isCorrect ? curr += 1 : curr += 0, 0);
  if (count !== 1) {
    const msg = `Exactly one answer must be correct, you provided: ${count} correct answers`;
    throw createError(msg, 400);
  }

  // Create questions, answers included
  const question = await Question.create({ text, Answers: answers }, { include: [Answer] });

  // associate with desired category
  await question.setCategory(category);

  return question;
}

export async function prefetchQuestion(questionId) {
  const question = await Question.findById(questionId, { include: [Answer] });
  if (!question) { throw questionNotFound; }
  return question;
}

export async function getQuestionsByCategory(CategoryId) {
  // make sure that the category exisists
  const category = await Category.findById(CategoryId);
  if (!category) { throw categoryNotFound; }

  const questions = await Question.findAll({ where: { CategoryId } });
  return questions;
}

export async function updateQuestion(question, text, categoryId, answers = []) {
  // check if category has to be updated
  let updateCategory = false;
  let categoryToSet;
  if (categoryId) {
    // check if category exists
    const dbCategory = await Category.findById(categoryId);
    if (!dbCategory) { throw categoryNotFound; }

    updateCategory = true;
    categoryToSet = dbCategory;
  }

  // check if any of the answer texts exists
  if (answers.length > 0) {
    const textFieldCompares = answers.map(({ text }) => {
      const compare = { text };
      return compare;
    });
    const query = {
      where: { [Op.or]: textFieldCompares }
    };
    const duplicateAnswers = await Answer.findAll(query);
    if (duplicateAnswers.length > 0) {
      const msg = 'An answer with this text already exists. use PUT /answers to update an answer.';
      throw createError(msg, 400);
    }
  }

  // update association
  if (updateCategory) {
    await question.setCategory(categoryToSet);
  }

  // check if the text has to be updated
  if (text) {
    question.text = text;
    await question.save();
  }

  // Add new answers
  await Promise.all(answers.map(async (answer) => { // eslint-disable-line no-undef
    // if answer is correcct, the former answer has to made incorrect
    if (answer.isCorrect) {
      const query = { where: { QuestionId: question.id, isCorrect: true } };
      const formerCorrectAnswer = await Answer.findOne(query);
      // it would be no problem if there was no former correct answer, we can just add this one
      // but we still don't want to crash the application
      if (formerCorrectAnswer) {
        formerCorrectAnswer.isCorrect = false;
        await formerCorrectAnswer.save();
      }
    }

    const newAnswer = await Answer.create(answer);
    await question.addAnswer(newAnswer);
  }));

  // unfortunetly I think we have to refetch the question
  const updatedQuestion = await Question.findById(question.id, { include: [Answer] });

  return updatedQuestion;
}

export async function deleteQuestion(questionId) {
  // We need to fetch the answeredQuestions and reports as well
  const question = await Question.findById(questionId, { include: [Answer, Report] });

  // delete answers
  await Promise.all(question.Answers // eslint-disable-line no-undef
    .map(async answer => {
      const query = { where: { AnswerId: answer.id } };
      const answeredQuestions = await AnsweredQuestion.findAll(query);
      await Promise.all(answeredQuestions // eslint-disable-line no-undef
        .map(async statistic => {
          await statistic.destroy()
        }));
      await answer.destroy();
    }));

  // delete reports
  await Promise.all(question.Reports // eslint-disable-line no-undef
    .map(async report => await report.destroy()));

  await question.destroy();
  const msg = `Successfully deleted question ${question.id} and ${question.Answers.length} anwers`;
  return { message: msg };
}

export async function createReport(QuestionId, message) {
  await Report.create({ message, QuestionId });
  return { message: 'Success.' };
}
