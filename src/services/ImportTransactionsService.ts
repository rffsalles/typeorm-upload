import fs from 'fs';
import csvParse from 'csv-parse';
import CreateTransactionService from './CreateTransactionService';

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(path: string): Promise<CreateTransaction[]> {
    const readCSVStream = fs.createReadStream(path);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);
    const transactions: CreateTransaction[] = [];
    parseCSV.on('data', line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );
      transactions.push({ title, type, value, category });
    });
    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });
    const createTransaction = new CreateTransactionService();
    transactions.forEach(async element => {
      const { title, type, value, category } = element;
      await createTransaction.execute({
        title,
        type,
        value,
        category,
      });
    });
    return transactions;
  }
}

export default ImportTransactionsService;
