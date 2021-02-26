import { Request, Response } from "express";
import { resolve } from "path";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUserRepository } from "../repositories/SurveysUserRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUserRepository);

        const user = await usersRepository.findOne({ email });
        if (!user) {
            return response.status(400).json({
                error: "User does not exists",
            })
        }

        const survey = await surveysRepository.findOne({
            id: survey_id
        })
        if (!survey) {
            return response.status(400).json({
                error: "Survey does not exists!"
            })
        }


        // Caminho
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        //Variaveis
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            // user_id: user.id,
            id: '',
            link: process.env.URL_MAIL
        }

        const surveyUsersAlreadyExist = await surveysUsersRepository.findOne({
            where: [{ user_id: user.id }, { value: null }],
            relations: ["user", "survey"]
        })

        if (surveyUsersAlreadyExist) {
            variables.id = surveyUsersAlreadyExist.id
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUsersAlreadyExist);
        }

        //Salvar as informações na tabela
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        });
        await surveysUsersRepository.save(surveyUser);
        variables.id = surveyUser.id;
        //Enviar email para o usuário
        await SendMailService.execute(email, survey.title, variables, npsPath);
        console.log(variables);
        return response.json(surveyUser);
    }
}

export { SendMailController };