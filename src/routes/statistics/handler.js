import { sequelize } from '../../models';

export async function getOverallStatistics(userId) {
  const query = `
    SELECT Categories.id AS id, Answers.isCorrect, COUNT(*) AS count
    FROM Users
    JOIN AnsweredQuestions
    JOIN Answers
    JOIN Questions
    JOIN Categories
    ON Users.id = AnsweredQuestions.UserId
    AND AnsweredQuestions.AnswerId = Answers.id
    AND Answers.QuestionId = Questions.id
    AND Questions.CategoryId = Categories.id
    WHERE Users.id = :userId
    GROUP BY Answers.isCorrect, Categories.id
    ORDER BY Categories.id ASC
  `;
  const result = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements: { userId }
  });

  return {
    userId,
    statisticsByCategoryId: parseResults(result),
  }
}

export async function getStatisticsByCategoryId(userId, categoryId) {
  const query = `
    SELECT Questions.id AS id, Answers.isCorrect, COUNT(*) AS count
    FROM Users
    JOIN AnsweredQuestions
    JOIN Answers
    JOIN Questions
    JOIN Categories
    ON Users.id = AnsweredQuestions.UserId
    AND AnsweredQuestions.AnswerId = Answers.id
    AND Answers.QuestionId = Questions.id
    AND Questions.CategoryId = Categories.id
    WHERE Users.id = :userId
    AND Categories.id = :categoryId
    GROUP BY Answers.isCorrect, Questions.id
    ORDER BY Questions.id ASC
  `;
  const result = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements: { userId, categoryId }
  });

  return {
    userId,
    statisticsByQuestionId: parseResults(result),
  }
}

export async function getStatisticsByQuestionId(userId, questionId) {
  const query = `
    SELECT Answers.id AS id, Answers.isCorrect, COUNT(*) AS count
    FROM Users
    JOIN AnsweredQuestions
    JOIN Answers
    JOIN Questions
    ON Users.id = AnsweredQuestions.UserId
    AND AnsweredQuestions.AnswerId = Answers.id
    AND Answers.QuestionId = Questions.id
    WHERE Users.id = :userId
    AND Questions.id = :questionId
    GROUP BY Answers.isCorrect, Answers.id
    ORDER BY Answers.id ASC
`;
  const result = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    replacements: { userId, questionId }
  });

  return {
    userId,
    statisticsByAnswerId: result.reduce((prev, { id, isCorrect, count }) => {
      prev[id] = { isCorrect: isCorrect == 1 ? true : false, count };
      return prev;
    }, {}),
  }
}

// transforms the sql rows into the appropriate scheme
function parseResults(results) {
  const parsed = {};

  for (let i = 0; i < results.length; i++) {
    const currentStat = results[i];

    if (!parsed[currentStat.id]) {
      parsed[currentStat.id] = {}
    }

    if (currentStat.isCorrect) {
      parsed[currentStat.id].correctCount = currentStat.count;
    } else {
      parsed[currentStat.id].wrongCount = currentStat.count;
    }

  }

  return parsed;
}
