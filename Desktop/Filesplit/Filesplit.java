import java.io.*;
import java.util.*;

public class Filesplit {

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        Queue<String> queue = new LinkedList<>();

        try {
            System.out.print("Masukkan nama file teks: ");
            String fileName = input.nextLine();

            System.out.print("Masukkan jumlah potongan: ");
            int parts = input.nextInt();

            // Membaca file dan memasukkan ke Queue
            BufferedReader br = new BufferedReader(new FileReader(fileName));
            String line;
            while ((line = br.readLine()) != null) {
                queue.add(line);
            }
            br.close();

            int totalLines = queue.size();
            int linesPerPart = (int) Math.ceil((double) totalLines / parts);

            // Proses pemotongan file
            for (int i = 1; i <= parts; i++) {
                BufferedWriter bw = new BufferedWriter(
                        new FileWriter("output_" + i + ".txt")
                );

                for (int j = 0; j < linesPerPart && !queue.isEmpty(); j++) {
                    bw.write(queue.poll());
                    bw.newLine();
                }
                bw.close();
            }

            System.out.println("File berhasil dipotong menjadi " + parts + " bagian.");

        } catch (IOException e) {
            System.out.println("Terjadi kesalahan: " + e.getMessage());
        }
    }
}
