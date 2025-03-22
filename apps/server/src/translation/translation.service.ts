import { Injectable } from "@nestjs/common";
import { languages } from "@reactive-resume/utils";

@Injectable()
export class TranslationService {
  fetchLanguages() {
    return languages;
  }
}
