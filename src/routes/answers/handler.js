import { Op } from 'sequelize';
import { Answer, Question, AnsweredQuestion } from '../../models';
import { answerNotFound, questionNotFound } from '../../commonErrors';
import { createError } from '../../util';

export async function prefetchAnswer(answerId) {
  const answer = await Answer.findById(answerId);
  if (!answer) { throw answerNotFound }
  return answer;
}

export async function updateAnswer(dbAnswer, text, isCorrect, questionId) {
  if (questionId) {
    const question = await Question.findById(questionId);
    if (!question) { throw questionNotFound; }
    await dbAnswer.setQuestion(question);
  }

  if (text) {
    dbAnswer.text = text;
  }

  if (isCorrect !== undefined) {
    if (isCorrect) {
      // this is the new correct answer, we have to find the old one and set it to false
      const formerCorrectAnswerQuery = { where: { QuestionId: questionId || dbAnswer.QuestionId, isCorrect: true } };
      const formerCorrectAnswer = await Answer.findOne(formerCorrectAnswerQuery);

      // someone could try to update a correct answer to a correct answer
      if (formerCorrectAnswer && formerCorrectAnswer.id !== dbAnswer.id) {
        formerCorrectAnswer.isCorrect = false;
        await formerCorrectAnswer.save();
      }
    } else {
      // this answer will become incorrect,
      // make sure that this question has still a correct answer
      const remainingCorrectAnswerQuery = {
        where: {
          QuestionId: questionId,
          isCorrect: true,
          [Op.not]: { id: dbAnswer.id },
        }
      };
      const remainingCorrectAnswer = await Answer.findAll(remainingCorrectAnswerQuery);
      if (remainingCorrectAnswer.length <= 0) {
        throw createError('Setting this answer to false would result in a question without a correct answer', 400);
      }
    }

    dbAnswer.isCorrect = isCorrect;
  }

  return await dbAnswer.save();
}

export async function deleteAnswer(dbAnswer) {
  // delete statistics
  const answeredQuestions = await AnsweredQuestion.findAll({ where: { AnswerId: dbAnswer.id } });
  await Promise.all(answeredQuestions // eslint-disable-line no-undef
    .map(async statistic => await statistic.destroy()));

  // delete answer
  await dbAnswer.destroy();

  return { message: `Successfully deleted answer ${dbAnswer.id} including ${answeredQuestions.length} statistic(s).` };
}

export async function answerQuestion(dbAnswer, UserId) {
  // Create a new statistics entry
  await AnsweredQuestion.create({ UserId, AnswerId: dbAnswer.id });

  // Get the corresponding question
  const { id: questionId, Answers: answers } = await Question.findById(dbAnswer.QuestionId, { include: [Answer] });

  // Get all answers for this question from this user
  const query = {
    where: {
      UserId,
      [Op.or]: answers.map(({ id }) => ({ AnswerId: id })),
    }
  };
  const answeredQuestions = await AnsweredQuestion.findAll(query);

  // Count right and wrong answers
  const { correctCount, wrongCount } = answeredQuestions.reduce((current, { AnswerId }) => {
    // Find the corresponding answer from the prefetched array
    const { isCorrect } = findAnswerInArray(AnswerId, answers);

    // add the value to current
    isCorrect ? current.correctCount += 1 : current.wrongCount += 1;
    return current;
  }, { correctCount: 0, wrongCount: 0 });

  // Assemble statistics
  const statistics = {
    userId: UserId,
    questionId,
    correctCount,
    wrongCount,
    totalCount: correctCount + wrongCount,
  };
  return statistics;
}

// This method assumes the answerId is present in the array!
function findAnswerInArray(answerId, answers) {
  for (let i = 0; i < answers.length; i++) {
    const currentAnswer = answers[i];
    if (currentAnswer.id === answerId) return currentAnswer;
  }
  return undefined;
}
